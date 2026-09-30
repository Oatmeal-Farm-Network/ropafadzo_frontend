<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>
 <title>Associate Photos Page</title>
       <link rel="stylesheet" type="text/css" href="/administration/<%=Style%>">



</HEAD>

<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">

<!--#Include file="/Administration/Header.asp"--> 

<table leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
	<tr>
		<td class = "body">
			 <H2>Associate Images
			<img src = "images/underline.jpg"></H2>
			After your images have been uploaded to your server they need to be associate with your site. Use the tools below to associate images with were you want them to appear on your site.<br><br>
			<b><i>Note: to associate photos of external studs, use the External Studs page</i></b><br><br>
		</td>
	</tr>
</table>

<%  
dim aID(40000)
dim aName(40000)

	conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
"Data Source=" & server.mappath(DatabasePath) & ";" & _
						"User Id=;Password=;" 
	sql2 = "select Animals.ID, Animals.FullName from Animals order by Animals.FullName "

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
			<H3>Animal List Pages</H3>
			<%
			dim fs,fo,x, count
			dim FileName(200)
			set fs=Server.CreateObject("Scripting.FileSystemObject")
			set fo=fs.GetFolder("e:\\filewww\\alpacasontheweb.com\\uploads\\ListPage")
			pcount = 1
			for each x in fo.files
			  FileName(pcount) = x.Name
			  ' Response.write(FileName(pcount) & "<br />")
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
						<option name = "PhotoName" value="<%=FileName(count)%>">
							<%=FileName(count)%>
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
			<H3>Detail Pages </H3>
			<%
			dim DFileName(40000)
			set fs=Server.CreateObject("Scripting.FileSystemObject")
			set fo=fs.GetFolder("e:\\filewww\\alpacasontheweb.com\\uploads\\DetailPage"  )
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
					<input type=submit value = "Submit Changes" style="background-image: url('images/background.jpg'); border-width:1px" size = "110" class = "menu" >
				</td>
			  </tr>
		    </table>
		  </form>
		</td>
	</tr>

</table>
<br><br>


<tr>
		<td>
			<H3>Head Image</H3>
			<%
			dim HeadFileName(40000)
			set fs=Server.CreateObject("Scripting.FileSystemObject")
			set fo=fs.GetFolder("e:\\filewww\\alpacasontheweb.com\\uploads\\DetailPage"  )
			pcount = 1
			for each x in fo.files
			 HeadFileName(pcount) = x.Name
			  ' Response.write(DFileName(pcount) & "<br />")
			pcount = pcount + 1
			next
			set fo=nothing
			set fs=nothing
			%>

			<form action= 'AddPhotoshandleform.asp' method = "post">
				<input type = "hidden" name="PhotoType" value= "Head">
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
						<option name = "PhotoName" value="<%=HeadFileName(count)%>">
							<%=HeadFileName(count)%>
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

</table>

<tr>
		<td>
			<H3>Bite Image</H3>
			<%
			dim BiteFileName(40000)
			set fs=Server.CreateObject("Scripting.FileSystemObject")
			set fo=fs.GetFolder("e:\\filewww\\alpacasontheweb.com\\uploads\\DetailPage"  )
			pcount = 1
			for each x in fo.files
			  BiteFileName(pcount) = x.Name
			  ' Response.write(DFileName(pcount) & "<br />")
			pcount = pcount + 1
			next
			set fo=nothing
			set fs=nothing
			%>

			<form action= 'AddPhotoshandleform.asp' method = "post">
				<input type = "hidden" name="PhotoType" value= "Bite">
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
						<option name = "PhotoName" value="<%=BiteFileName(count)%>">
							<%=BiteFileName(count)%>
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

</table>

<tr>
		<td>
			<H3>Fleece Image</H3>
			<%
			dim FleeceFileName(40000)
			set fs=Server.CreateObject("Scripting.FileSystemObject")
			set fo=fs.GetFolder("e:\\filewww\\alpacasontheweb.com\\uploads\\DetailPage"  )
			pcount = 1
			for each x in fo.files
			  FleeceFileName(pcount) = x.Name
			  ' Response.write(DFileName(pcount) & "<br />")
			pcount = pcount + 1
			next
			set fo=nothing
			set fs=nothing
			%>

			<form action= 'AddPhotoshandleform.asp' method = "post">
				<input type = "hidden" name="PhotoType" value= "Fleece">
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
						<option name = "PhotoName" value="<%=FleeceFileName(count)%>">
							<%=FleeceFileName(count)%>
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

</table>

<tr>
		<td>
			<H3>Front Image</H3>
			<%
			dim FrontFileName(40000)
			set fs=Server.CreateObject("Scripting.FileSystemObject")
			set fo=fs.GetFolder("e:\\filewww\\alpacasontheweb.com\\uploads\\DetailPage"  )
			pcount = 1
			for each x in fo.files
			  FrontFileName(pcount) = x.Name
			  ' Response.write(DFileName(pcount) & "<br />")
			pcount = pcount + 1
			next
			set fo=nothing
			set fs=nothing
			%>

			<form action= 'AddPhotoshandleform.asp' method = "post">
				<input type = "hidden" name="PhotoType" value= "Front">
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
						<option name = "PhotoName" value="<%=FrontFileName(count)%>">
							<%=FrontFileName(count)%>
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

</table>

<tr>
		<td>
			<H3>Rear Image</H3>
			<%
			dim RearFileName(40000)
			set fs=Server.CreateObject("Scripting.FileSystemObject")
			set fo=fs.GetFolder("e:\\filewww\\alpacasontheweb.com\\uploads\\DetailPage"  )
			pcount = 1
			for each x in fo.files
			  RearFileName(pcount) = x.Name
			  ' Response.write(DFileName(pcount) & "<br />")
			pcount = pcount + 1
			next
			set fo=nothing
			set fs=nothing
			%>

			<form action= 'AddPhotoshandleform.asp' method = "post">
				<input type = "hidden" name="PhotoType" value= "Rear">
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
						<option name = "PhotoName" value="<%=RearFileName(count)%>">
							<%=RearFileName(count)%>
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

</table>
<br><br><br>
<!--#Include file="/Administration/Footer.asp"--> </Body>
</HTML>