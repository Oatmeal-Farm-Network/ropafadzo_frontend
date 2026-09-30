
<html>
<head>

<%  PageName = "Adopt-A-Wheel" %>
<!--#Include virtual="GlobalVariables.asp"-->
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title><%= SEOTitle %> </title>
<META name="description" content="<%= SEODescription %> ">
<META name="keywords" content="<%= SEOKeyword1 %>, 
<%=SEOKeyword2%>, 
<%=SEOKeyword3 %>,
<%=SEOKeyword4 %>, 
<%=SEOKeyword5 %>, 
<%=SEOKeyword6 %>,  
<%=SEOKeyword7 %>, 
<%=SEOKeyword8 %>, 
<%=SEOKeyword9 %>, 
<%=SEOKeyword10 %>, 
<%=SEOKeyword11 %>, 
 <%=SEOKeyword12 %>, 
 <%=SEOKeyword13 %>, 
 <%=SEOKeyword14 %>, 
 <%=SEOKeyword15 %>, 
 <%=SEOKeyword16 %>, 
 <%=SEOKeyword17 %>, 
 <%=SEOKeyword18 %>, 
 <%=SEOKeyword19 %>, 
 <%=SEOKeyword20 %> ">


<meta name="author" content="WebArtists.biz">
<link rel="shortcut icon" href="<%=ShortIcon%>" /> 
<link rel="icon" href="<%=LongIcon%>" /> 
<meta name="author" content="WebArtists.biz">
<link rel="stylesheet" type="text/css" href="BarnStyle.css">


</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include virtual="Header.asp"-->
<Table border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center" valign = "top" width = "720">
		<tr>
				<td class = "body" align ="left">
					<br><h1><%=Pagetitle %></h1>
				</td>
			</tr>
		<tr>
				<td class = "body" align ="left" bgcolor = "#670000" height = "1"><img src = "images/px.gif" height = "1"></td>
			</tr>
			<tr>
			   <td class = "body"><br>
						<% If Len(Image1) > 1 Then %> 
									<img src = "<%=Image1 %>" border = "1" align = "right" valign = "top" width = "290">
							<% end if %>
							<%=PageText %>
	
				
<center>
		<form target="_paypal" action="https://www.paypal.com/cgi-bin/webscr" method="post">
		
	<input type="hidden" name="add" value="1">
<input type="hidden" name="cmd" value="_cart">
<input type="hidden" name="business" value="jhartwig@clearwire.net">
<input type="hidden" name="item_name" value="Adopt A Wheel">
$<input type="text" name="amount" value=" ">
<input type="hidden" name="no_shipping" value="0">
<input type="hidden" name="no_note" value="1">
<input type="hidden" name="currency_code" value="USD">
<input type="hidden" name="lc" value="US">
<input type="hidden" name="bn" value="PP-ShopCartBF">
<input type="hidden" name="return" value="http://www.ArtisanBarn.org/completion.asp">
<input type="hidden" name="cancel_return" value="http://www.ArtisanBarn.org/BarnStore.asp">


<input type=submit   border="0" name="submit"  Value = "Donate" >&nbsp;&nbsp;

</form> 
</center>
<br><br>
		</td>
	</tr>
</table>

		</td>
	</tr>
</table>
	</td>
	</tr>
</table>


<!--#Include file="Footer.asp"-->
</body>
</html>
