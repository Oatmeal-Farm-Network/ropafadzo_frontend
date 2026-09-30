<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>
 <title>Upload & Associate Photos Page</title>
             <link rel="stylesheet" type="text/css" href="<%=Style%>">


</HEAD>

<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  background = "images/background.jpg">
<!--#Include file="GlobalVariables.asp"--> 
<!--#Include file="Header.asp"--> 

<table leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
	<tr>
		<td class = "body">
			 <a name="Upload"></a><H2>Upload Photos
			<img src = "images/underline.jpg"></H2>
			Before you can associate an image with an animal you have to copy it up to the server first. <br><br>
		</td>
	</tr>
</table>
<table leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
	<tr>
<td width = "400" align = "center">
			<H3>List Page Images (Small)</H3>

			<p><font face="Verdana, Arial, Helvetica, sans-serif" size="2"></font></p>
			
			<p><b><font face="Verdana, Arial, Helvetica, sans-serif" size="2" color="#FF0000">only gif and jpg formats</font><br>
			</p>
			</center><form ENCTYPE="multipart/form-data" ACTION= "<%=WebSiteAddress%>/cgi-bin/upload.cgi" METHOD="POST"><center>
<input TYPE="FILE" NAME="file-to-upload-01" SIZE="35">
<p>
<input TYPE="SUBMIT" VALUE="Upload Now!">
    <p> <font size="1" face="Verdana, Arial, Helvetica, sans-serif">After clicking 
      &quot;Upload Now&quot; it may take a short while to send your image.<%=WebSiteAddress%></font><br>
</center>
</form>

		</td>


		<td width = "400" align = "center">
		<H3><b>Detail Page & Product Images</b> (Large)</H3>
			<p><font face="Verdana, Arial, Helvetica, sans-serif" size="2"></font></p>
			<p><b><font face="Verdana, Arial, Helvetica, sans-serif" size="2" color="#FF0000">only gif and jpg formats</font><br>
			</p>
			</center>
			
			<form ENCTYPE="multipart/form-data" ACTION="<%=WebSiteAddress%>/cgi-bin/uploadDetail.cgi" METHOD="POST"><center>
<input TYPE="FILE" NAME="file-to-upload-01" SIZE="35">
<p>
<input TYPE="SUBMIT" VALUE="Upload Now!">
    <p> <font size="1" face="Verdana, Arial, Helvetica, sans-serif">After clicking 
      &quot;Upload Now&quot; it may take a short while to send your image.</font><br>
</center>
</form>
			
			
			
			
			
		</td>
		
	</tr>
</table>
<table leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
	<tr>
		<td class = "body">
			 <a name="Associate"></a><H2>Associate Images
			<img src = "images/underline.jpg"></H2>
			After your images have been uploaded to your server they need to be associate with your site. Use the tools below to associate images with were you want them to appear on your site.<br><br>
			<b><i>Note: to associate photos of outside studs, use the Outside Studs page</i></b><br><br>
		</td>
	</tr>
</table>

<%  
dim aID(40000)
dim aName(40000)
Dim acounter
	conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
"Data Source=" & server.mappath(DatabasePath) & ";" & _
						"User Id=;Password=;" 
	sql2 = "select Animals.ID, Animals.FullName from Animals order by Animals.FullName" 

	acounter = 1
	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3 
	
	While Not rs2.eof  
		aID(acounter) = rs2("ID")
		aName(acounter) = rs2("FullName")
		'response.write (SSName(studcounter))

		acounter = acounter +1
		rs2.movenext
	Wend		
	
		rs2.close
		set rs2=nothing
		set conn = nothing



%>




<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
	<tr>
		<td>
			<H3>List Page Images (Small)</H3>
			<%
			dim DFileName(200)
			set fs=Server.CreateObject("Scripting.FileSystemObject")
			set fo=fs.GetFolder(PhysicalPath & "\\uploads\\ListPage"  )
			pcount = 1
			for each x in fo.files
			  DFileName(pcount) = x.Name
			  ' Response.write(DFileName(pcount) & "<br />")
			pcount = pcount + 1
			next
			set fo=nothing
			set fs=nothing
			%>

			<form action= 'AddPhotoshandleform.asp' method = "post">
				<input type = "hidden" name="PhotoType" value= "ListPage">
			   <table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
			   <tr>
				 <td>
					<b>Alpaca's Name</b><br>
					<select size="1" name="AID">
					<option name = "AID0" value= "" selected></option>
					<% count = 1
						while count < acounter
						response.write(count)
					%>
						<option name = "AID1" value="<%=aID(count)%>">
							<%=aName(count)%>
						</option>
					<% 	count = count + 1
					wend %>
					</select>
				</td>
				<td>
					<b>Photo</b><br>
					<select size="1" name="Photo">
					<option name = "PhotoName" value= "" selected></option>
					<% count = 1
						while count < pcount
						response.write(count)
					%>
						<option name = "PhotoName" value="<%=DFileName(count)%>">
							<%=DFileName(count)%>
						</option>
					<% 	count = count + 1
					wend %>
					</select>
				</td>
				<td>
					<br>
					<input type=submit value = "Submit Changes" style="background-image: url('images/background.jpg'); border-width:1px" size = "110" class = "menu" >
				</td>
			  </tr>
		    </table>
		  </form>
		</td>
	</tr>
<tr>
		<td>
			<H3>Detail Pages Images (Large) </H3>
			<%
			
			set fs=Server.CreateObject("Scripting.FileSystemObject")
			set fo=fs.GetFolder(PhysicalPath & "\\Uploads\\DetailPage"  )
			pcount = 1
			for each x in fo.files
			  DFileName(pcount) = x.Name
			  ' Response.write(DFileName(pcount) & "<br />")
			pcount = pcount + 1
			next
			set fo=nothing
			set fs=nothing
			%>

			<form action= 'AddPhotoshandleform.asp' method = "post">
				<input type = "hidden" name="PhotoType" value= "DetailPage">
			   <table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
			   <tr>
				 <td>
					<b>Alpaca's Name</b><br>
					<select size="1" name="AID">
					<option name = "AID0" value= "" selected></option>
					<% count = 1
						while count < acounter
						response.write(count)
					%>
						<option name = "AID1" value="<%=aID(count)%>">
							<%=aName(count)%>
						</option>
					<% 	count = count + 1
					wend %>
					</select>
				</td>
				<td>
					<b>Photo</b><br>
					<select size="1" name="Photo">
					<option name = "PhotoName" value= "" selected></option>
					<% count = 1
						while count < pcount
						response.write(count)
					%>
						<option name = "PhotoName" value="<%=DFileName(count)%>">
							<%=DFileName(count)%>
						</option>
					<% 	count = count + 1
					wend %>
					</select>
				</td>
				<td>
					<br>
					<input type=Submit value = "Submit Changes" style="background-image: url('images/background.jpg'); border-width:1px" size = "110" class = "menu" >
				</td>
			  </tr>
		    </table>
		  </form>
		</td>
	</tr>
	

<%	

dim dID(200)
dim dName(200)
dim dPhotoID(200)
dim	dImage(200)
dim	dImageOrder(200)
dim	dImageTitle(200)


conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
"Data Source=" & server.mappath(DatabasePath) & ";" & _
						"User Id=;Password=;" 
	sqld = "select Animals.ID, Animals.FullName, AdditionalPhotos.* from Animals, AdditionalPhotos where Animals.ID = AdditionalPhotos.ID ORDER by Animals.FullName ASC"

	dcounter = 1
	Set rsd = Server.CreateObject("ADODB.Recordset")
	rsd.Open sqld, conn, 3, 3 
	While Not rsd.eof  
		dID(dcounter) = rsd("AdditionalPhotos.ID")
		dName(dcounter) = rsd("FullName")
		dPhotoID(dcounter) = rsd("PhotoID")
		dImage(dcounter) = rsd("Image")
		dImageOrder(dcounter) = rsd("PhotoOrder")
		dImageTitle(dcounter) = rsd("ImageTitle")
		'response.write (rsd("AdditionalPhotos.ID"))

		dcounter = dcounter +1
		rsd.movenext
	Wend		
	
		rsd.close
		set rsd=nothing
		set conn = nothing



%>


	<tr>
		<td nowrap class = "body">
			<H3>Current Detail Page Photos</H3>
			<form action= 'PhotoOrder.asp' method = "post">	
				<table border = "1">
				<tr>
						   <td class = "body" align = "center">
							<b>PhotoID</b>
							</td>
							<td align = "center" class = "body">
							<b>Alpacas' Name</b>
							</td>
							<td class = "body" align = "center">
								<b>Image</b>
							</td>
							<td class = "body" align = "center">
								<b>Order</b>
							</td>
						</tr>
					<% count = 1
						while count < dcounter  %>
						<tr>
							<td class = "body">
								<input name="PID(<%=count%>)" value= "<%= dPhotoID(count)%>" type = "hidden"><big><%=dPhotoID(count)%></big>
							</td>
							<td class = "body">
							<%=dName(count)%>
							</td>
							<td class = "body">
							<%=dImage(count)%>
							</td>
							<td class = "body">
							<select size="1" name="Order(<%=count%>)">
								<option name = "Order1" value= "<% = dImageOrder(count)%>" selected><% =  dImageOrder(count)%></option>
								<option name = "Order2" value="1">1</option>
								<option name = "Order3" value="2">2</option>
								<option name = "Order6" value="3">3</option>
								<option name = "Order7" value="4">4</option>
								<option name = "Order8" value="5">5</option>
								<option name = "Order9" value="6">6</option>
								<option name = "Order10" value="7">7</option>
								<option name = "Order11" value="8">8</option>
								<option name = "Order12" value="9">9</option>
					</select>
							</td>
						</tr>
					<% 	count = count + 1
					wend %>
					<input name="TotalCount" value= "<%= count%>" type = "hidden">
			<tr>
		<td colspan = "4" align = "center" valign = "middle">
			
			<Input type = Hidden name='TotalCount' value = <%=TotalCount%> >
			<input type=submit value = "Submit Changes" style="background-image: url('images/background.jpg'); border-width:1px" size = "110" class = "menu" >
			</form>
		</td>
</tr>
</table>
						
<H3>Unassociate Detail Page Photos</H3>
			<form action= 'DeleteAdditionalPhotos.asp' method = "post">
				<input type = "hidden" name="PhotoType" value= "AdditionalPhotos">
			   <table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
			   <tr>
				 <td nowrap class = "body">
					<b>PhotoID</b><br>
					<select size="1" name="PhotoID">
					<option name = "PhotoID0" value= "" selected></option>
					<% count = 1
						while count < dcounter
						response.write(count)
					%>
						<option name = "PhotoID1" value="<%=dPhotoID(count)%>">
							<%=dPhotoID(count)%> - <%=dName(count)%> - <%=dImage(count)%>
							</option>
					<% 	count = count + 1
					wend %>
					</select>
				</td>
							
				<td nowrap class = "body">
					<br>
					<input type=submit value = "Un-Associate" style="background-image: url('images/background.jpg'); border-width:1px" size = "110" class = "menu" >
				</td>
			  </tr>
		    </table>
		  </form>
		</td>
	</tr>
</table>
<br><br>
</BODY>
</HTML>